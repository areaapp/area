package com.example.area_android

import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONObject


/**
 * A simple [Fragment] subclass.
 * Activities that contain this fragment must implement the
 * [LogWithServicesFragment.OnFragmentInteractionListener] interface
 * to handle interaction events.
 * Use the [LogWithServicesFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class LogWithServicesFragment : Fragment() {
    private var listener: OnServiceLoginListener? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)


    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_log_with_services, container, false)
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnServiceLoginListener) {
            listener = context
        } else {
            throw RuntimeException(context.toString() + " must implement OnFragmentInteractionListener")
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     *
     *
     * See the Android Training lesson [Communicating with Other Fragments]
     * (http://developer.android.com/training/basics/fragments/communicating.html)
     * for more information.
     */
    interface OnServiceLoginListener {
        fun onConnectionSuccess()
        fun onConnectionFailed()
    }

    companion object {
        @JvmStatic
        fun newInstance() =
            LogWithServicesFragment().apply {}
    }

    fun getServices() {
        val app = this.activity!!.application as AreaApplication
        val url: String = app.serverUrl!! + "/services"
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        listener!!.onConnectionFailed()
                    }
                    is Result.Success -> {
                        this.addServices(result.get().obj())
                        listener!!.onConnectionSuccess()
                    }
                }
            }
    }

    private fun addServices(obj: JSONObject) {
        val serviceButtonsLayout = view!!.findViewById<LinearLayout>(R.id.serviceButtonsLayout)

        val data: JSONObject = obj.getJSONObject("data")
        var iter: MutableIterator<String> = data.keys()
        while (iter.hasNext()) {
            val serviceName = iter.next()
            val service: JSONObject = data.getJSONObject(serviceName)
            val icon = service.getString("iconName").replace('-', '_').toUpperCase()

            val d: Drawable =
                MaterialDrawableBuilder.with(this.activity) // provide a context
                    .setIcon(MaterialDrawableBuilder.IconValue.valueOf(icon)) // provide an icon
                    .setColor(Color.WHITE) // set the icon color
                    .setToActionbarSize() // set the icon size
                    .build() // Finally call build

            val button = MaterialButton(this.activity!!)
            button.text = service.getString("displayName")
            button.icon = d
            button.setOnClickListener {
                this.redirectToService(service.getString("name"))
            }

            serviceButtonsLayout.addView(button)
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.activity!!.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this.activity, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            this.activity!!.finish()
            return
        }


        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this.activity, "Request failed", Toast.LENGTH_SHORT).show()
                    }
                    is Result.Success -> {
                        val data = result.get().obj().getString("data")

                        app.redirectAction = AreaApplication.ActionType.Signin
                        app.authService = serviceName
                        val webpage: Uri = Uri.parse(data)
                        val intent = Intent(Intent.ACTION_VIEW, webpage)
                        startActivity(intent)
                    }
                }
            }
    }
}
