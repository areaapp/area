package com.example.area_android.ui.services

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.size
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.*
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import kotlinx.android.synthetic.main.fragment_areas.*
import kotlinx.android.synthetic.main.fragment_services.*
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class ServicesFragment : Fragment() {

    private lateinit var servicesViewModel: ServicesViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        servicesViewModel =
            ViewModelProviders.of(this).get(ServicesViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_services, container, false)

        val app = this.activity!!.application as AreaApplication

        val url : String = app.serverUrl + "/services"
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                    }
                    is Result.Success -> {
                        this.addServices(result.get().obj())
                    }
                }
            }

        return root
    }

    private fun addServices(obj: JSONObject) {
        val serviceButtonsLayout = view!!.findViewById<LinearLayout>(R.id.serviceButtonsLayout)
        serviceButtonsLayout.removeViewsInLayout(0, serviceButtonsLayout.size)

        val data: JSONObject = obj.getJSONObject("data")
        var iter: MutableIterator<String> = data.keys()
        while (iter.hasNext()) {
            val serviceName = iter.next()
            val service: JSONObject = data.getJSONObject(serviceName)
            val icon = service.getString("iconName").replace('-', '_').toUpperCase()

            val d: Drawable =
                MaterialDrawableBuilder.with(context) // provide a context
                    .setIcon(MaterialDrawableBuilder.IconValue.valueOf(icon)) // provide an icon
                    .setColor(Color.WHITE) // set the icon color
                    .setToActionbarSize() // set the icon size
                    .build() // Finally call build

            val button = MaterialButton(context!!)
            button.text = service.getString("displayName")
            button.icon = d
            button.setOnClickListener {
                val intent = Intent(this.activity, ServiceActivity::class.java)

                intent.putExtra("service", service.getString("name"))
                startActivity(intent)
            }

            serviceButtonsLayout.addView(button)
        }
    }

}