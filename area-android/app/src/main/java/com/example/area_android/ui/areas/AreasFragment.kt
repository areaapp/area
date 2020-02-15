package com.example.area_android.ui.areas

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.view.isEmpty
import androidx.core.view.size
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.NewAreaActivity
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_areas.*
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class AreasFragment : Fragment() {

    private lateinit var areasViewModel: AreasViewModel
    private var areas: MutableList<JSONObject> = ArrayList()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        areasViewModel =
            ViewModelProviders.of(this).get(AreasViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_areas, container, false)

        val addServiceButton = root.findViewById<FloatingActionButton>(R.id.addServiceButton)

        addServiceButton.setOnClickListener {
            val intent = Intent(this.activity, NewAreaActivity::class.java);
            startActivityForResult(intent, 0)
        }

        this.getAreas(root)
        return root
    }

    private fun getAreas(root: View) {
        val app = this.activity!!.application as AreaApplication

        val areaList = root.findViewById<ListView>(R.id.areas)
        Fuel.get(app.serverUrl + "/me/areas")
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                println(result.get())
                val data = result.get().obj().getJSONArray("data")

                this.areas.clear()
                areaList.removeAllViewsInLayout()

                val areaNames: MutableList<String> = ArrayList()
                for (i in 0 until data.length()) {
                    val datum = data.getJSONObject(i)
                    areas.add(datum)
                    areaNames.add(datum.getString("name"))
                }

                val adapter: ArrayAdapter<String> = ArrayAdapter(this.activity!!,
                    android.R.layout.simple_list_item_1, android.R.id.text1, areaNames)

                areaList.adapter = adapter
            }
    }
}